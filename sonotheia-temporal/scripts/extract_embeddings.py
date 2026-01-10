#!/usr/bin/env python3
"""
Temporal Embedding Extraction Script

This script extracts temporal embeddings from audio files using:
1. Whisper for speech-to-text transcription with word-level timestamps
2. GPT-2 for extracting contextual embeddings from all 12 transformer layers

The output includes:
- CSV file with timestamps, words, and layer-wise embeddings
- Heatmap visualization showing embedding evolution across layers and time
"""

import argparse
import os
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import warnings

import numpy as np
import pandas as pd
import torch
import whisper
import librosa
from transformers import GPT2Tokenizer, GPT2Model
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# Suppress warnings for cleaner output
warnings.filterwarnings("ignore")


class AudioEmbeddingExtractor:
    """
    Extracts temporal embeddings from audio files.

    This class handles the complete pipeline:
    1. Audio loading and preprocessing
    2. Whisper transcription with word-level timing
    3. GPT-2 embedding extraction from all layers
    4. Data export and visualization
    """

    def __init__(
        self,
        whisper_model: str = "base",
        gpt2_model: str = "gpt2",
        device: Optional[str] = None,
    ):
        """
        Initialize the extractor with specified models.

        Args:
            whisper_model: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
            gpt2_model: GPT-2 model variant ('gpt2', 'gpt2-medium', 'gpt2-large', 'gpt2-xl')
            device: Device to use ('cuda', 'cpu', or None for auto-detect)
        """
        # Determine device
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device

        print(f"Using device: {self.device}")

        # Load Whisper model for transcription
        print(f"Loading Whisper model ({whisper_model})...")
        try:
            self.whisper_model = whisper.load_model(whisper_model, device=self.device)
        except Exception as e:
            raise RuntimeError(f"Failed to load Whisper model: {e}")

        # Load GPT-2 model and tokenizer for embeddings
        print(f"Loading GPT-2 model ({gpt2_model})...")
        try:
            self.tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model)
            self.gpt2_model = GPT2Model.from_pretrained(gpt2_model)
            self.gpt2_model.to(self.device)
            self.gpt2_model.eval()  # Set to evaluation mode
        except Exception as e:
            raise RuntimeError(f"Failed to load GPT-2 model: {e}")

        # GPT-2 base has 12 layers (0-11)
        self.num_layers = self.gpt2_model.config.n_layer
        print(f"GPT-2 model has {self.num_layers} layers")

    def load_audio(self, audio_path: str, sr: int = 16000) -> np.ndarray:
        """
        Load and preprocess audio file.

        Args:
            audio_path: Path to the audio file
            sr: Target sample rate (Whisper uses 16kHz)

        Returns:
            Audio signal as numpy array

        Raises:
            FileNotFoundError: If audio file doesn't exist
            RuntimeError: If audio loading fails
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        print(f"\nLoading audio from: {audio_path}")

        try:
            # Load audio and resample to target sample rate
            audio, _ = librosa.load(audio_path, sr=sr, mono=True)

            duration = len(audio) / sr
            print(f"Audio duration: {duration:.2f} seconds")
            print(f"Sample rate: {sr} Hz")

            return audio

        except Exception as e:
            raise RuntimeError(
                f"Failed to load audio file: {e}\n"
                f"Supported formats: WAV, MP3, FLAC, OGG, M4A"
            )

    def transcribe_with_timestamps(self, audio: np.ndarray) -> Dict:
        """
        Transcribe audio using Whisper and extract word-level timestamps.

        Args:
            audio: Audio signal as numpy array

        Returns:
            Dictionary containing transcription results with word-level timing
        """
        print("\nTranscribing audio with Whisper...")

        try:
            # Transcribe with word-level timestamps
            result = self.whisper_model.transcribe(
                audio, word_timestamps=True, verbose=False
            )

            # Extract word-level information
            words_with_timestamps = []

            for segment in result["segments"]:
                if "words" in segment:
                    for word_info in segment["words"]:
                        words_with_timestamps.append(
                            {
                                "word": word_info["word"].strip(),
                                "start": word_info["start"],
                                "end": word_info["end"],
                            }
                        )

            print(
                f"Transcription complete: {len(words_with_timestamps)} words detected"
            )
            print(f"Full text: {result['text']}")

            return {"text": result["text"], "words": words_with_timestamps}

        except Exception as e:
            raise RuntimeError(f"Transcription failed: {e}")

    def extract_gpt2_embeddings(self, text: str) -> Tuple[np.ndarray, List[str]]:
        """
        Extract GPT-2 embeddings from all layers for the given text.

        Args:
            text: Input text to process

        Returns:
            Tuple of (embeddings array, token list)
            - embeddings: shape (num_tokens, num_layers, hidden_size)
            - tokens: list of token strings
        """
        print("\nExtracting GPT-2 embeddings...")

        # Tokenize the text
        inputs = self.tokenizer(text, return_tensors="pt")
        input_ids = inputs["input_ids"].to(self.device)

        # Decode tokens for reference
        tokens = [self.tokenizer.decode([token_id]) for token_id in input_ids[0]]

        print(f"Processing {len(tokens)} tokens...")

        # Extract embeddings from all layers
        with torch.no_grad():
            outputs = self.gpt2_model(
                input_ids, output_hidden_states=True  # Get all layer outputs
            )

            # hidden_states is a tuple of (num_layers + 1) tensors
            # First element is embedding layer, rest are transformer layers
            hidden_states = outputs.hidden_states

            # Stack all transformer layer outputs
            # Shape: (num_layers, batch_size, seq_len, hidden_size)
            layer_embeddings = torch.stack(hidden_states[1:])  # Skip embedding layer

            # Rearrange to (seq_len, num_layers, hidden_size)
            layer_embeddings = layer_embeddings.squeeze(1).permute(1, 0, 2)

            # Convert to numpy
            embeddings = layer_embeddings.cpu().numpy()

        print(f"Extracted embeddings shape: {embeddings.shape}")
        print(f"  - Tokens: {embeddings.shape[0]}")
        print(f"  - Layers: {embeddings.shape[1]}")
        print(f"  - Embedding dimension: {embeddings.shape[2]}")

        return embeddings, tokens

    def align_embeddings_to_words(
        self,
        words_with_timestamps: List[Dict],
        tokens: List[str],
        embeddings: np.ndarray,
    ) -> pd.DataFrame:
        """
        Align GPT-2 token embeddings to word-level timestamps from Whisper.

        This is a simplified alignment that maps words to their corresponding tokens.
        For more sophisticated alignment, consider using forced alignment tools.

        Args:
            words_with_timestamps: List of words with timing information
            tokens: List of GPT-2 tokens
            embeddings: Token embeddings array

        Returns:
            DataFrame with columns: timestamp, word, layer_0, layer_1, ..., layer_N
        """
        print("\nAligning embeddings to word timestamps...")

        # Create a simple word-to-token mapping
        # This is approximate and could be improved with more sophisticated alignment
        words = [w["word"] for w in words_with_timestamps]
        full_text = " ".join(words)

        # Re-tokenize to get alignment
        token_positions = []
        current_pos = 0

        for i, word_info in enumerate(words_with_timestamps):
            word = word_info["word"]
            # Find which tokens correspond to this word
            word_tokens = self.tokenizer.encode(word, add_special_tokens=False)

            # Simple mapping: assign the timestamp to all tokens of this word
            for _ in word_tokens:
                if current_pos < len(tokens):
                    token_positions.append(
                        {
                            "word": word,
                            "start": word_info["start"],
                            "end": word_info["end"],
                            "token_idx": current_pos,
                        }
                    )
                    current_pos += 1

        # Build DataFrame with embeddings
        rows = []

        for pos in token_positions:
            row = {
                "timestamp": pos["start"],
                "word": pos["word"],
                "token": tokens[pos["token_idx"]].replace("\n", "\\n"),
            }

            # Add embeddings from each layer
            token_idx = pos["token_idx"]
            for layer_idx in range(embeddings.shape[1]):
                # Store the full embedding vector as a string representation
                # or key statistics (mean, std) for CSV compatibility
                layer_emb = embeddings[token_idx, layer_idx, :]

                # Option 1: Store statistics (more CSV-friendly)
                row[f"layer_{layer_idx}_mean"] = np.mean(layer_emb)
                row[f"layer_{layer_idx}_std"] = np.std(layer_emb)
                row[f"layer_{layer_idx}_norm"] = np.linalg.norm(layer_emb)

                # Option 2: Store full vector (can be very wide)
                # Uncomment if you need full vectors in CSV
                # for dim_idx, val in enumerate(layer_emb):
                #     row[f'layer_{layer_idx}_dim_{dim_idx}'] = val

            rows.append(row)

        df = pd.DataFrame(rows)
        print(f"Created DataFrame with {len(df)} rows and {len(df.columns)} columns")

        return df, embeddings, tokens

    def save_embeddings(
        self,
        df: pd.DataFrame,
        output_path: str,
        embeddings: Optional[np.ndarray] = None,
    ):
        """
        Save embeddings to CSV file.

        Args:
            df: DataFrame containing aligned embeddings
            output_path: Path to save the CSV file
            embeddings: Optional full embeddings array to save separately
        """
        print(f"\nSaving embeddings to: {output_path}")

        # Save CSV with statistics
        df.to_csv(output_path, index=False)
        print(f"Saved CSV with shape: {df.shape}")

        # Optionally save full embeddings as numpy array
        if embeddings is not None:
            npy_path = output_path.replace(".csv", "_full.npy")
            np.save(npy_path, embeddings)
            print(f"Saved full embeddings to: {npy_path}")

    def visualize_embeddings(
        self,
        df: pd.DataFrame,
        embeddings: np.ndarray,
        output_path: str,
        metric: str = "norm",
    ):
        """
        Create a heatmap visualization of embeddings across layers and time.

        Args:
            df: DataFrame with embedding statistics
            embeddings: Full embeddings array
            output_path: Path to save the visualization
            metric: Which metric to visualize ('mean', 'std', 'norm')
        """
        print(f"\nGenerating visualization...")

        # Extract the metric for each layer
        num_layers = embeddings.shape[1]
        layer_cols = [f"layer_{i}_{metric}" for i in range(num_layers)]

        if not all(col in df.columns for col in layer_cols):
            print(f"Warning: Not all layer columns found for metric '{metric}'")
            return

        # Create heatmap data
        heatmap_data = df[layer_cols].values.T  # Transpose: layers x time

        # Create figure
        fig, axes = plt.subplots(2, 1, figsize=(16, 10))

        # Heatmap
        ax1 = axes[0]
        sns.heatmap(
            heatmap_data,
            cmap="viridis",
            cbar_kws={"label": f"Embedding {metric.capitalize()}"},
            ax=ax1,
            xticklabels=False,
        )
        ax1.set_ylabel("Layer", fontsize=12)
        ax1.set_title(
            f"GPT-2 Embedding Evolution Across Layers and Time\n"
            f"({metric.capitalize()} values)",
            fontsize=14,
            fontweight="bold",
        )

        # Time series for each layer
        ax2 = axes[1]
        time_points = df["timestamp"].values

        for layer_idx in range(num_layers):
            values = df[f"layer_{layer_idx}_{metric}"].values
            ax2.plot(time_points, values, alpha=0.6, label=f"Layer {layer_idx}")

        ax2.set_xlabel("Time (seconds)", fontsize=12)
        ax2.set_ylabel(f"Embedding {metric.capitalize()}", fontsize=12)
        ax2.set_title("Temporal Evolution by Layer", fontsize=12, fontweight="bold")
        ax2.legend(bbox_to_anchor=(1.05, 1), loc="upper left", fontsize=8)
        ax2.grid(True, alpha=0.3)

        # Add word annotations if not too many
        if len(df) < 50:
            unique_words = df.drop_duplicates("word")
            for _, row in unique_words.iterrows():
                ax2.axvline(
                    row["timestamp"],
                    color="red",
                    alpha=0.2,
                    linestyle="--",
                    linewidth=0.5,
                )

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        print(f"Saved visualization to: {output_path}")
        plt.close()

    def process_audio_file(
        self, audio_path: str, output_dir: Optional[str] = None
    ) -> Tuple[pd.DataFrame, str, str]:
        """
        Complete pipeline: process audio file and generate outputs.

        Args:
            audio_path: Path to input audio file
            output_dir: Directory for outputs (default: ../data/embeddings/)

        Returns:
            Tuple of (DataFrame, csv_path, plot_path)
        """
        # Set up output directory
        if output_dir is None:
            output_dir = Path(__file__).parent.parent / "data" / "embeddings"

        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Generate output filenames
        audio_name = Path(audio_path).stem
        csv_path = output_dir / f"{audio_name}_embeddings.csv"
        plot_path = output_dir / f"{audio_name}_visualization.png"

        # Step 1: Load audio
        audio = self.load_audio(audio_path)

        # Step 2: Transcribe with timestamps
        transcription = self.transcribe_with_timestamps(audio)

        # Step 3: Extract GPT-2 embeddings
        embeddings, tokens = self.extract_gpt2_embeddings(transcription["text"])

        # Step 4: Align embeddings to words
        df, embeddings, tokens = self.align_embeddings_to_words(
            transcription["words"], tokens, embeddings
        )

        # Step 5: Save embeddings
        self.save_embeddings(df, str(csv_path), embeddings)

        # Step 6: Create visualization
        self.visualize_embeddings(df, embeddings, str(plot_path))

        print("\n" + "=" * 60)
        print("PROCESSING COMPLETE!")
        print("=" * 60)
        print(f"CSV output: {csv_path}")
        print(f"Visualization: {plot_path}")
        print("=" * 60)

        return df, str(csv_path), str(plot_path)


def main():
    """Main entry point for command-line usage."""
    parser = argparse.ArgumentParser(
        description="Extract temporal embeddings from audio files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage
  python extract_embeddings.py input.wav

  # Specify output directory
  python extract_embeddings.py input.mp3 --output-dir ./my_embeddings/

  # Use larger models for better quality
  python extract_embeddings.py input.wav --whisper-model medium --gpt2-model gpt2-large

  # Force CPU usage
  python extract_embeddings.py input.wav --device cpu
        """,
    )

    parser.add_argument(
        "audio_file", type=str, help="Path to the audio file to process"
    )

    parser.add_argument(
        "--output-dir",
        type=str,
        default=None,
        help="Directory for output files (default: ../data/embeddings/)",
    )

    parser.add_argument(
        "--whisper-model",
        type=str,
        default="base",
        choices=["tiny", "base", "small", "medium", "large"],
        help="Whisper model size (default: base)",
    )

    parser.add_argument(
        "--gpt2-model",
        type=str,
        default="gpt2",
        choices=["gpt2", "gpt2-medium", "gpt2-large", "gpt2-xl"],
        help="GPT-2 model variant (default: gpt2)",
    )

    parser.add_argument(
        "--device",
        type=str,
        default=None,
        choices=["cuda", "cpu"],
        help="Device to use for computation (default: auto-detect)",
    )

    args = parser.parse_args()

    try:
        # Initialize extractor
        extractor = AudioEmbeddingExtractor(
            whisper_model=args.whisper_model,
            gpt2_model=args.gpt2_model,
            device=args.device,
        )

        # Process audio file
        extractor.process_audio_file(
            audio_path=args.audio_file, output_dir=args.output_dir
        )

        return 0

    except FileNotFoundError as e:
        print(f"\nError: {e}", file=sys.stderr)
        return 1
    except RuntimeError as e:
        print(f"\nError: {e}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        return 130
    except Exception as e:
        print(f"\nUnexpected error: {e}", file=sys.stderr)
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())

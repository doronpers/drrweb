# Sonotheia Temporal Embeddings

A Python toolkit for extracting temporal contextual embeddings from audio files using Whisper transcription and GPT-2 language model representations.

## Overview

This project enables the analysis of how language model embeddings evolve temporally in spoken audio. It combines:

- **Whisper**: For accurate speech-to-text transcription with word-level timestamps
- **GPT-2**: For extracting contextual embeddings from all 12 transformer layers
- **Temporal Alignment**: Mapping embeddings to specific moments in audio

### Use Cases

- Analyzing temporal coherence in speech
- Detecting deepfake audio through embedding patterns
- Studying how neural representations evolve over time
- Comparing authentic vs. synthetic speech embeddings
- Research in speech processing and NLP

## Project Structure

```
sonotheia-temporal/
├── data/
│   ├── goldstein_neural/    # Goldstein et al. neural speech data
│   ├── deepfake_corpus/     # Deepfake audio samples
│   ├── test_samples/        # Test audio files
│   └── embeddings/          # Output: extracted embeddings
├── models/                  # Saved model checkpoints (optional)
├── scripts/
│   └── extract_embeddings.py  # Main extraction script
├── analysis/                # Analysis notebooks and scripts
├── docs/                    # Documentation
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) CUDA-capable GPU for faster processing

### Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd sonotheia-temporal
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   This will install:
   - `transformers` - Hugging Face library for GPT-2
   - `torch` - PyTorch for deep learning
   - `openai-whisper` - OpenAI's Whisper for transcription
   - `librosa` - Audio processing
   - `numpy`, `pandas` - Data manipulation
   - `matplotlib`, `seaborn` - Visualization

4. **Verify installation**:
   ```bash
   python scripts/extract_embeddings.py --help
   ```

## Usage

### Basic Example

Extract embeddings from a single audio file:

```bash
python scripts/extract_embeddings.py data/test_samples/sample.wav
```

This will:
1. Transcribe the audio using Whisper
2. Extract GPT-2 embeddings from all 12 layers
3. Align embeddings to word timestamps
4. Save results to `data/embeddings/`

### Command-Line Options

```bash
python scripts/extract_embeddings.py <audio_file> [options]
```

**Arguments**:
- `audio_file` - Path to audio file (WAV, MP3, FLAC, OGG, M4A)

**Options**:
- `--output-dir DIR` - Output directory (default: `data/embeddings/`)
- `--whisper-model SIZE` - Whisper model: tiny, base, small, medium, large (default: base)
- `--gpt2-model MODEL` - GPT-2 variant: gpt2, gpt2-medium, gpt2-large, gpt2-xl (default: gpt2)
- `--device DEVICE` - Computation device: cuda or cpu (default: auto-detect)

### Advanced Examples

**High-quality transcription with larger models**:
```bash
python scripts/extract_embeddings.py input.wav \
  --whisper-model medium \
  --gpt2-model gpt2-large
```

**Process multiple files**:
```bash
for file in data/test_samples/*.wav; do
  python scripts/extract_embeddings.py "$file"
done
```

**Force CPU usage** (if no GPU available):
```bash
python scripts/extract_embeddings.py input.wav --device cpu
```

## Expected Outputs

For each processed audio file `example.wav`, the script generates:

### 1. CSV File: `example_embeddings.csv`

Contains word-level embeddings with columns:

| Column | Description |
|--------|-------------|
| `timestamp` | Word start time in seconds |
| `word` | Transcribed word |
| `token` | GPT-2 token representation |
| `layer_0_mean` | Mean of layer 0 embedding |
| `layer_0_std` | Standard deviation of layer 0 |
| `layer_0_norm` | L2 norm of layer 0 embedding |
| ... | (repeated for layers 1-11) |

**Example**:
```csv
timestamp,word,token,layer_0_mean,layer_0_std,layer_0_norm,layer_1_mean,...
0.0,Hello,Hello,0.245,0.512,2.341,0.189,...
0.4,world,world,0.198,0.478,2.156,0.234,...
```

### 2. Numpy File: `example_embeddings_full.npy`

Full embedding vectors for advanced analysis:
- Shape: `(num_tokens, num_layers, hidden_dim)`
- For GPT-2 base: `(N, 12, 768)` where N = number of tokens
- Load with: `np.load('example_embeddings_full.npy')`

### 3. Visualization: `example_visualization.png`

Two-panel figure:
- **Top**: Heatmap showing embedding norms across layers (y-axis) and time (x-axis)
- **Bottom**: Time series plot of embedding evolution for each layer

## Model Information

### Whisper Models

| Model | Parameters | Speed | Accuracy | Use Case |
|-------|------------|-------|----------|----------|
| tiny | 39M | Fastest | Good | Quick testing |
| base | 74M | Fast | Better | Default, balanced |
| small | 244M | Moderate | Good | Higher accuracy |
| medium | 769M | Slow | Very good | Production |
| large | 1550M | Slowest | Best | Research |

### GPT-2 Models

| Model | Layers | Hidden Size | Parameters | Embedding Dim |
|-------|--------|-------------|------------|---------------|
| gpt2 | 12 | 768 | 117M | 768 |
| gpt2-medium | 24 | 1024 | 345M | 1024 |
| gpt2-large | 36 | 1280 | 774M | 1280 |
| gpt2-xl | 48 | 1600 | 1558M | 1600 |

**Note**: This script extracts embeddings from all layers of the chosen model. For consistency with 12-layer analysis, use the base `gpt2` model.

## Troubleshooting

### Common Issues

**1. Out of Memory Error**:
- Use smaller models: `--whisper-model tiny --gpt2-model gpt2`
- Use CPU: `--device cpu`
- Process shorter audio clips

**2. Audio Format Not Supported**:
```
Error: Failed to load audio file
```
Solution: Convert to WAV format:
```bash
ffmpeg -i input.mp3 output.wav
```

**3. CUDA Out of Memory**:
```
RuntimeError: CUDA out of memory
```
Solution: Use CPU or smaller model:
```bash
python scripts/extract_embeddings.py input.wav --device cpu
```

**4. Whisper Model Download Issues**:
- Models are downloaded automatically on first use
- Ensure internet connection
- Models cached in `~/.cache/whisper/`

## Technical Details

### Embedding Extraction Process

1. **Audio Loading**: Resample to 16kHz (Whisper requirement)
2. **Transcription**: Whisper extracts text + word timestamps
3. **Tokenization**: GPT-2 tokenizes transcribed text
4. **Forward Pass**: Extract hidden states from all layers
5. **Alignment**: Map tokens to word timestamps (approximate)
6. **Export**: Save embeddings with temporal information

### Alignment Method

The script uses a simplified token-to-word alignment:
- Each word's timestamp is assigned to its corresponding GPT-2 tokens
- For exact alignment, consider tools like Montreal Forced Aligner

### Embedding Statistics

For CSV compatibility, we store three statistics per layer:
- **Mean**: Average activation value
- **Std**: Standard deviation (spread of values)
- **Norm**: L2 norm (overall magnitude)

Full 768-dimensional vectors are saved separately in `.npy` format.

## Future Extensions

Potential enhancements:

- [ ] Batch processing with progress tracking
- [ ] Support for speaker diarization
- [ ] Alternative embedding models (BERT, RoBERTa)
- [ ] Advanced token-word alignment (forced alignment)
- [ ] Temporal pooling strategies
- [ ] Integration with deepfake detection classifiers
- [ ] Analysis notebooks for common workflows

## Data Sources

The `data/` directory is structured for specific datasets:

- **goldstein_neural/**: Neural speech recordings from Goldstein et al. studies
- **deepfake_corpus/**: Synthetic speech samples for authenticity detection
- **test_samples/**: Small audio clips for testing and development

## Citation

If you use this toolkit in your research, please cite:

```bibtex
@software{sonotheia_temporal,
  title={Sonotheia Temporal Embeddings},
  author={Your Name},
  year={2025},
  url={https://github.com/yourusername/sonotheia-temporal}
}
```

## License

[Your chosen license - MIT, Apache 2.0, etc.]

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Contact

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@domain.com]

## Acknowledgments

- OpenAI for the Whisper model
- Hugging Face for the transformers library
- The PyTorch team for the deep learning framework

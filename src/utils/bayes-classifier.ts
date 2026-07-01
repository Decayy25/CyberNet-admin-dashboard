export interface ClassificationResult {
  label: string;
  value: number;
}

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

export class BayesClassifier {
  private documents: { text: string; label: string }[] = [];
  private vocabulary = new Set<string>();
  private wordFrequency = new Map<string, Map<string, number>>();
  private classFrequency = new Map<string, number>();
  private totalWords = new Map<string, number>();
  private totalDocuments = 0;

  addDocument(text: string, label: string): void {
    this.documents.push({ text, label });
    const tokens = tokenize(text);

    this.classFrequency.set(label, (this.classFrequency.get(label) || 0) + 1);

    if (!this.wordFrequency.has(label)) {
      this.wordFrequency.set(label, new Map());
    }

    const classWords = this.wordFrequency.get(label)!;
    let wordCount = this.totalWords.get(label) || 0;

    tokens.forEach((token) => {
      this.vocabulary.add(token);
      classWords.set(token, (classWords.get(token) || 0) + 1);
      wordCount += 1;
    });

    this.totalWords.set(label, wordCount);
    this.totalDocuments += 1;
  }

  train(): void {
    // no-op for compatibility
  }

  classify(text: string): string {
    const classifications = this.getClassifications(text);
    return classifications.length > 0
      ? classifications[0].label
      : "tidak_tersedia";
  }

  getClassifications(text: string): ClassificationResult[] {
    const tokens = tokenize(text);
    const labels = Array.from(this.classFrequency.keys());

    const scores: ClassificationResult[] = labels.map((label) => ({
      label,
      value: this.calculateProbability(label, tokens),
    }));

    return scores.sort((a, b) => b.value - a.value);
  }

  private calculateProbability(label: string, tokens: string[]): number {
    const classFreq = this.classFrequency.get(label) || 1;
    const classProbability = classFreq / this.totalDocuments;

    let logProbability = Math.log(classProbability);
    const classWords = this.wordFrequency.get(label);
    const totalClassWords = this.totalWords.get(label) || 1;

    tokens.forEach((token) => {
      const wordFreq = classWords?.get(token) || 0;
      const smoothedFreq =
        (wordFreq + 1) / (totalClassWords + this.vocabulary.size);
      logProbability += Math.log(smoothedFreq);
    });

    return Math.exp(logProbability);
  }
}

export default BayesClassifier;

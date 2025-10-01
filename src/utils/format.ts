export function formatLabels(labels: string[]): string {
  return labels.filter(label => label.trim()).join('; ')
}

export function parseLabels(labelsString: string): string[] {
  return labelsString
    .split(';')
    .map(label => label.trim())
    .filter(label => label.length > 0)
}

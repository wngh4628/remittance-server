export class TraceId {
  private id: string;
  private level: number;

  constructor(previousId?: TraceId) {
    this.id = previousId ? previousId.id : this.generateId();
    this.level = previousId ? previousId.level + 1 : 0;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  getId(): string {
    return this.id;
  }

  getLevel(): number {
    return this.level;
  }

  createNextId(): TraceId {
    return new TraceId(this);
  }

  createPreviousId(): TraceId | null {
    return this.level > 0 ? new TraceId(this) : null;
  }

  isFirstLevel(): boolean {
    return this.level === 0;
  }
}

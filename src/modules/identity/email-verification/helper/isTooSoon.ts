function isTooSoon(createdAt: Date, cooldownInSeconds: number = 60): boolean {
  const now = new Date();

  const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

  return diffInSeconds < cooldownInSeconds;
}

export { isTooSoon };

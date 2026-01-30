interface PrismaDelegate<T, CreateDto, UpdateDto, FilterDto> {
  create(args: { data: CreateDto }): Promise<T>;
  findUnique(args: { where: any }): Promise<T | null>;
  findMany(args?: FilterDto): Promise<T[]>;
  update(args: { where: any; data: UpdateDto }): Promise<T>;
  delete(args: { where: any }): Promise<T>;
}

export { PrismaDelegate };

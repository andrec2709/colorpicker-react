export default interface IPaletteSorter {
    moveOver(targetId: string, overId: string): Promise<void>;
    create(toEnd?: boolean): Promise<number>;
}
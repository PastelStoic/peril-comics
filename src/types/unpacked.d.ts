/**
 * Given a typed array, returns the type of the array elements.
 */
type Unpacked<T> = T extends (infer U)[] ? U : T;
export default Unpacked;
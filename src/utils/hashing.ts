import bcrypt from "bcrypt";
export const hash = async (plaintext: string): Promise<string> => {
  return await bcrypt.hash(plaintext, 10);
};

export const compare = async (
  plaintext: string,
  currentHashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(plaintext, currentHashed);
};

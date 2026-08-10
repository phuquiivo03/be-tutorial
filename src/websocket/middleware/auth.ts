import { IncomingMessage } from "http";
import { verifyAndGetAuthUser } from "../../shared/middlewares/helper";
import { AppError, ErrorCodes, ErrorMessages } from "../../shared/errors";
import { RequestUser } from "../../modules/user/user.type";

export const authenSocketConnection = async (
  request: IncomingMessage,
): Promise<RequestUser> => {
  const authToken = request.headers["x-token"] as string;
  if (!authToken) {
    throw new AppError(ErrorCodes.BAD_REQUEST, ErrorMessages.UN_AUTHORISED);
  }
  const authUser = await verifyAndGetAuthUser(authToken);
  return authUser;
};

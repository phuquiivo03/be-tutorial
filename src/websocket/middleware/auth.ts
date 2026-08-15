import { IncomingMessage } from "http";
import { verifyAndGetAuthUser } from "../../shared/middlewares/helper";
import { AppError, ErrorCodes, ErrorMessages } from "../../shared/errors";
import { RequestUser } from "../../modules/user/user.type";

export const authenSocketConnection = async (
  request: IncomingMessage,
): Promise<RequestUser> => {
  const host = request.headers.host;
  const fullUrl = `http://${host}${request.url}`;
  const { searchParams } = new URL(fullUrl);
  const authToken = searchParams.get("authToken");
  if (!authToken) {
    throw new AppError(ErrorCodes.BAD_REQUEST, ErrorMessages.UN_AUTHORISED);
  }
  const authUser = await verifyAndGetAuthUser(authToken);
  return authUser;
};

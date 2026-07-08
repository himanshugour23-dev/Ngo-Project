import jwt,{JwtPayload} from "jsonwebtoken";
export interface NgoJwtPayload extends JwtPayload {
  ngoId: string;
  type: "access" | "refresh";
}
export const generateAccessToken = (ngoId : string) =>{
    return jwt.sign(
        {
            ngoId,
            type : "access"
        }
        , process.env.JWT_ACCESS_SECRET!
        , {expiresIn : "15m"}
    );
} ;

export const generateRefreshToken = (ngoId : string) =>{
    return jwt.sign(
        {
            ngoId,
            type : "refresh"
        }
        , process.env.JWT_REFRESH_SECRET!
        , {expiresIn : "7d"}
    );
} ;

export const verifyAccessToken = (token: string): NgoJwtPayload => {return jwt.verify(token,process.env.JWT_ACCESS_SECRET!) as NgoJwtPayload;};

export const verifyRefreshToken = (token: string): NgoJwtPayload => {
  return jwt.verify(token,process.env.JWT_REFRESH_SECRET!
  ) as NgoJwtPayload;
};
import { createRefToken, createToken } from "../config/jwt.js";
import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const model = initModels(sequelize);

const register = async (req, res, next) => {
  try {
    // B1: nhan du lieu tu FE
    const { fullName, email, pass } = req.body;
    console.log({ fullName, email, pass });

    // Buoc 2: Ktra email da ton tai chua
    // Neu ton tai tra loi Tai khoan da ton tai
    // Neu chua ton tai di tiep

    const userExist = await model.users.findOne({
      where: {
        email: email,
      },
    });
    console.log({ userExist });
    if (userExist) {
      return res.status(400).json({
        message: `Tai khoan da ton tai`,
        data: null,
      });
    }

    // B3: them nguoi dung moi vao DB
    const userNew = await model.users.create({
      full_name: fullName,
      email: email,
      pass_word: bcrypt.hashSync(pass, 10),
    });

    // Cau hinh info email
    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to Our Service",
      text: `Hello ${fullName}. Best Regards`,
    };
    // gui mail
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        res.status(500).json({ message: "Send email err" });
      }
      return res.status(200).json({
        message: "Dang ky thanh cong",
        data: userNew,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const login = async (req, res) => {
  try {
    // B1: lay eamil va pass_word tu body req

    // B2: check user thong qua email (get user tu db)

    // Neu khong co user => ra erorr user not found

    // Neu co user => check pass_word

    //    Neu pass_word ko trung nhau => pass_word is wrong

    //   Neu pass_word trung nhau => tao access token

    let { email, pass_word } = req.body;
    let user = await model.users.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is wrong" });
    }

    let checkPass = bcrypt.compareSync(pass_word, user.pass_word);

    if (!checkPass) {
      return res.status(400).json({ message: "password is wrong" });
    }
    let payload = {
      userId: user.user_id,
    };
    // access token, refresh token
    // Tao token
    // Func sign jsonwebtoken
    // param 1: tao payload va luu vao token
    // param 2: key de tao token
    // param 3: setting lifetime cua token va thuat toan de tao token
    // let accessToken = jwt.sign({ payload }, "NODE44", {
    //   algorithm: "HS256",
    //   expiresIn: "1d",
    // });
    let accessToken = createToken(payload);
    let refreshToken = createRefToken(payload);
    console.log(refreshToken);
    await model.users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          user_id: user.user_id,
        },
      }
    );

    //luu refresh token vao cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie khong the truy cap tu js
      secure: false, // chay localhost
      sameSite: "Lax", // de dam bao cookie duoc gui trong cac domain khac nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, // thoi gian ton tai cookie trong browser
    });
    return res.status(200).json({
      message: "login successfully",
      data: {
        token: accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const loginFacebook = async (req, res) => {
  try {
    // B1: lay id email name tu request
    // B2: check id (app-face-id trong db)
    // B2.1 neu co id => tao access token gui cho FE
    // B2.2

    let { id, email, name } = req.body;
    let user = await model.users.findOne({
      where: { face_app_id: id },
    });
    if (!user) {
      let newUser = {
        full_name: name,
        face_app_id: id,
        email,
      };
      user = await model.users.create(newUser);
    }
    let accessToken = createToken({ userId: user.user_id });

    return res.status(200).json({
      message: "login successfully",
      data: {
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

const extendToken = async (req, res) => {
  try {
    // lay refresh tu cookie request
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      returnres.status(401).json({ message: "unauthorized" });
    }

    const checkRefToken = await model.users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!refreshToken) {
      return res.status(401);
    }

    const newToken = createToken({ userId: checkRefToken.user_id });
    return res.status(200).json({ message: "success", data: newToken });
  } catch (error) {
    return res.status(500).json({ message: "erorr" });
  }
};

export { register, login, loginFacebook, extendToken };

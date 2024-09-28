import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    return res.status(200).json({
      message: "Dang ky thanh cong",
      data: userNew,
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
    let accessToken = jwt.sign({ payload }, "NODE44", {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "login successfully",
      data: {
        token: accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

export { register, login };

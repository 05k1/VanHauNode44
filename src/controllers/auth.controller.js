import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

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
      pass_word: pass,
    });

    return res.status(200).json({
      message: "Dang ky thanh cong",
      data: userNew,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

export { register };

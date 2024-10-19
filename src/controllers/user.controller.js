import pool from "../../db.js";
import { OK, INTERNAL_SERVER } from "../../const.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize"; // toan tu

const model = initModels(sequelize);

const createUser = async (req, res) => {
  // let params = req.params;
  // let { id, Hoten } = params;
  // let body = req.body;
  // res.send({ id, Hoten });
  // lay data tu body cua req
  try {
    const { full_name, email, pass_word } = req.body;
    let newUser = await model.users.create({
      full_name,
      email,
      pass_word,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);

    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const getUsers = async (req, res) => {
  try {
    // const [data] = await pool.query(`
    //       select * from users
    //       limit 1
    //       `);
    // let { full_name =''} = req.query
    let full_name = req.query.full_name || "";
    let data = await model.users.findAll({
      where: {
        full_name: {
          [Op.like]: `%${full_name}%`,
        },
      },
      attributes: ["full_name"],
      include: [
        {
          model: model.video, // chon model muon ket ban
          as: "videos",
          attributes: ["video_name", "user_id"], // chi dinh truong nao se hien hti
          required: true, // default se ket bang left join, muon inner join required: true
          include: [
            {
              model: model.video_comment,
              as: "video_comments",
            },
          ],
        },
      ],
    });
    return res.status(OK).json(data);
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    let { user_id } = req.params;
    // const [data] = await pool.query(`
    //         delete from users
    //         where user_id = ${user_id}
    //         `);
    let user = await model.users.findByPk(user_id);
    if (!user) {
      res.status(404).json({ message: "uesr not found" });
    }
    user.destroy();
    return res.status(OK).json({ message: "User deleted successful" });
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};
const updateUser = async (req, res) => {
  try {
    let { user_id } = req.params;
    const { full_name, pass_word } = req.body;
    // check user co trong bd khong
    let user = await model.users.findByPk(user_id);
    // let user = await model.users.findOne({
    // where: {user_id}
    // })
    if (!user) {
      res.status(404).json({ message: "uesr not found" });
    }

    let data = await model.users.update(
      { full_name, pass_word },
      {
        where: { user_id },
      }
    );

    // Cach 2: dung chinh object user de update info User
    // user.full_name = full_name || user.full_name
    // user.pass_word = pass_word || user.pass_word
    // await user.save()

    return res.status(OK).json({ message: "User updated sucessfully" });
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    let file = req.file;
    let userId = req.body.userId;
    let user = await model.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let avatarPath = `/public/imgs/${file.filename}`;
    await model.users.update(
      { avatar: avatarPath },
      {
        where: {
          user_id: userId,
        },
      }
    );
    return res.status(200).json({ message: "upload avatar success" });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER)
      .json({ message: "error api upload avatar" });
  }
};

export { createUser, getUsers, deleteUser, updateUser, uploadAvatar };

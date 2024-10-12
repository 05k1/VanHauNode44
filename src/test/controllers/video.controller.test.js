import initModels from "../../models/init-models.js";
import sequelize from "../../models/connect.js";
import sinon from "sinon";
import { getListVideo } from "../../controllers/video.controller.js";
import { expect } from "chai";
import { afterEach } from "mocha";

const model = initModels(sequelize);

// describe define 1 bo test case
// happy case va case fail
describe("getVideos", () => {
  let req, res, findAllStub;

  beforeEach(() => {
    // gia lap request va response
    res = {};

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // gia lap findAll
    findAllStub = sinon.stub(model.video, "findAll");
  });

  // khoi phuc lai nhung setting sau khi test cac case
  afterEach(() => {
    sinon.restore();
  });
  it("return 200 and list of video", async () => {
    const videos = [
      {
        video_id: 1,
        video_name: "Introduction to Coding",
        thumbnail: "deadpool.jpg",
        description: "Learn the basics of coding",
        views: 1500,
        source: "youtube.com",
        user_id: 1,
        type_id: 2,
      },
    ];

    findAllStub.resolves(videos);
    await getListVideo(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    // kiem tra dung data
    expect(res.json.calledWith(videos)).to.be.true;
  });
});

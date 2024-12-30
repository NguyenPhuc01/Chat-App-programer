import CheckIn from "../models/checkIn.model.js";
import moment from "moment";
export const checkIn = async (req, res) => {
  try {
    const { userId, location } = req.body;
    console.log("🚀 ~ checkIn ~ location:", location);
    console.log("🚀 ~ checkIn ~ userId:", userId);
    const checkInRecord = new CheckIn({
      userId,
      checkInTime: moment(),
      location,
      totalHours: 0, // Chưa có thời gian check-out, nên đặt là 0
    });

    await checkInRecord.save();
    res.status(200).json({ message: "Check-in successful", checkInRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const checkOut = async (req, res) => {
  try {
    const { user_id } = req.body;

    // 1. Lấy ngày hiện tại
    const today = moment().startOf("day"); // Đảm bảo chỉ lấy ngày (không tính giờ)

    // 2. Tìm bản ghi check-in gần nhất trong cùng ngày
    const lastCheckIn = await CheckIn.findOne({
      user_id,
      date: { $gte: today.toDate(), $lt: today.endOf("day").toDate() },
    }).sort({ checkInTime: -1 }); // Sắp xếp giảm dần theo thời gian check-in
    console.log("🚀 ~ checkOut ~ lastCheckIn:", lastCheckIn);

    // 3. Nếu không tìm thấy bản ghi check-in trong ngày, trả về lỗi
    if (!lastCheckIn) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy bản ghi check-in trong ngày này." });
    }

    // 4. Nếu bản ghi check-in không có thời gian check-out, đặt mặc định là 17h
    // let checkOutTime = lastCheckIn.checkOutTime;

    // if (!checkOutTime) {
    //   const defaultCheckOutTime = moment(lastCheckIn.date).set({
    //     hour: 17,
    //     minute: 0,
    //     second: 0,
    //   });
    //   checkOutTime = defaultCheckOutTime.toDate();
    // }

    // 5. Cập nhật thời gian check-out

    // 6. Tính tổng số giờ đã làm
    const checkInTime = moment(lastCheckIn.checkInTime);
    const checkOutMoment = moment();
    const duration = moment.duration(checkOutMoment.diff(checkInTime));
    const totalHours = duration.asHours();
    console.log("🚀 ~ checkOut ~ totalHours:", totalHours);
    lastCheckIn.checkOutTime = moment();
    lastCheckIn.totalHours = totalHours.toFixed(2);
    await lastCheckIn.save();
    res.json({
      message: "Check-out thành công.",
      totalHours: totalHours.toFixed(2), // Làm tròn đến 2 chữ số thập phân
      checkOutTime: moment(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getListCheckIn = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }
    const startDate = moment()
      .year(year)
      .month(month - 1)
      .startOf("month")
      .toDate();
    const endDate = moment()
      .year(year)
      .month(month - 1)
      .endOf("month")
      .toDate();

    const data = await CheckIn.find({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    });
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No check-in records found for this user." });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

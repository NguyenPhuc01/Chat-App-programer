export function formatTimeMessage(date: Date) {
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
export function getCookie(name: string) {
  console.log("🚀 ~ getCookie ~ name:", name);
  let cookieArr = document.cookie.split(";");
  console.log("🚀 ~ getCookie ~ cookieArr:", cookieArr.length);
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    console.log("🚀 ~ getCookie ~ cookie:", cookie.indexOf(name + "="));
    // Kiểm tra xem cookie có tên như vậy không
    if (cookie.indexOf(name + "=") == 0) {
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Nếu không tìm thấy cookie
}

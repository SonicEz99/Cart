export function isAuthPage(pathname) {
    const authPages = ["/main","/carts"]; //ใส่routh ที่ต้องการแสดง nav และ sidebar
    return authPages.includes(pathname);//ถูกนำไปใช้ใน ClientLayout
  }

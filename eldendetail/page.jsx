import React from 'react';
import Navbar from '../components/Navbar';

function EldenDetail() {
  return (
    <div className="container">
      <Navbar /> {/* Navbar will be included on this page */}

      <div className="content">
        <div className="game-details">
          <img src="/elden.png" alt="Elden Ring" width={500} height={500} />
          <div className="game-info">
            <h2>ELDEN RING</h2>
            <p>
              ขอต้อนรับสู่ “The Lands Between” หรือในชื่อภาษาไทยว่า “ดินแดนมัชฌิมา” ที่นี่คือแดนศักดิ์สิทธิ์...
            </p>
          </div>
        </div>

        <div className="game-actions">
          <button className="add-to-cart">เพิ่มสินค้า</button>
          <p className="price">฿1790</p>
        </div>
      </div>
    </div>
  );
}

export default EldenDetail;

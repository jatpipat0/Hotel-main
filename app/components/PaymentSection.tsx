"use client";

import React, { useState } from 'react';

export default function PaymentSection() {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  
  // State สำหรับจัดการฟอร์มบัตรเครดิตและวันเกิด
  const [dob, setDob] = useState<string>(""); // วันเดือนปีเกิด (YYYY-MM-DD)
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [expiryError, setExpiryError] = useState<string>("");

  // 1. ฟังก์ชันจัดการ Card Number (ตัวเลขเท่านั้น สูงสุด 16 ตัว)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
  };

  // 2. ฟังก์ชันจัดการ Expiry Date (จัดรูปแบบ MM/YY และเทียบปีเกิด)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // จัดรูปแบบ MM/YY
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);

    // ตรวจสอบเงื่อนไขกับปีเกิด เมื่อกรอกครบ 5 ตัวอักษร (MM/YY)
    if (value.length === 5) {
      if (!dob) {
        setExpiryError("กรุณาระบุวันเดือนปีเกิดก่อน");
        return;
      }

      const dobYear = new Date(dob).getFullYear(); // ดึงปี ค.ศ. เกิด
      const expYear = 2000 + parseInt(value.substring(3, 5)); // แปลง YY เป็น YYYY

      // เงื่อนไขจำกัดตามปีเกิด ค.ศ.
      if (expYear <= dobYear) {
        setExpiryError("ปีที่หมดอายุต้องมากกว่าปีเกิด ค.ศ.");
      } else {
        setExpiryError("");
      }
    } else {
      setExpiryError(""); // ซ่อน Error หากยังกรอกไม่ครบ
    }
  };

  return (
    <section>
      <h2 className="font-serif text-3xl font-light text-slate-800 mb-8 pb-4 border-b border-slate-200">Payment Method</h2>
      <div className="space-y-4">
        
        {/* 1. Pay at Hotel */}
        <div 
          onClick={() => setPaymentMethod("pay_at_hotel")}
          className={`border cursor-pointer transition-all duration-300 overflow-hidden group ${
            paymentMethod === "pay_at_hotel" ? "border-[#B89146] bg-[#FAF9F6] shadow-md" : "border-slate-200 hover:border-[#B89146]"
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === "pay_at_hotel" ? "border-[#B89146]" : "border-slate-300"}`}>
                {paymentMethod === "pay_at_hotel" && <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>}
              </div>
              <div>
                <h4 className={`font-serif text-lg transition-colors ${paymentMethod === "pay_at_hotel" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}>Pay at Hotel</h4>
                <p className="text-xs font-light text-slate-500 mt-1">Settle your bill upon check-in</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Credit / Debit Card */}
        <div 
          onClick={() => setPaymentMethod("credit_card")}
          className={`border cursor-pointer transition-all duration-300 overflow-hidden group ${
            paymentMethod === "credit_card" ? "border-[#B89146] bg-white shadow-md" : "border-slate-200 hover:border-[#B89146]"
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === "credit_card" ? "border-[#B89146]" : "border-slate-300"}`}>
                {paymentMethod === "credit_card" && <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>}
              </div>
              <div>
                <h4 className={`font-serif text-lg transition-colors ${paymentMethod === "credit_card" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}>Credit / Debit Card</h4>
                <p className="text-xs font-light text-slate-500 mt-1">Pay securely via Stripe gateway</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-50 grayscale group-hover:grayscale-0 transition-all">
               <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
               <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
            </div>
          </div>

          {/* --- ส่วนกรอกข้อมูลบัตร --- */}
          {paymentMethod === "credit_card" && (
            <div className="px-6 pb-8 pt-2 border-t border-slate-100 bg-[#FAF9F6] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 gap-6 mt-4">
                
                {/* วันเดือนปีเกิด */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800"
                  />
                </div>

                {/* หมายเลขบัตร */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 tracking-widest"
                  />
                </div>

                {/* ชื่อเจ้าของบัตร */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Name on Card</label>
                  <input 
                    type="text" 
                    placeholder="YOUR NAME"
                    className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 uppercase"
                  />
                </div>

                {/* วันหมดอายุ และ CVC */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Expiry Date (MM/YY)</label>
                    <input 
                      type="text" 
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM / YY"
                      maxLength={5}
                      className={`w-full border-b py-2 bg-transparent outline-none transition-colors font-light text-center ${
                        expiryError ? "border-red-500 text-red-600 focus:border-red-500" : "border-slate-300 focus:border-[#B89146] text-slate-800 placeholder:text-slate-300"
                      }`}
                    />
                    {expiryError && (
                      <p className="text-red-500 text-[10px] mt-1">{expiryError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">CVC (Back of Card)</label>
                    <div className="relative">
                        <input 
                          type="text" 
                          placeholder="123"
                          maxLength={3}
                          onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                          className="w-full border-b border-slate-300 py-2 bg-transparent outline-none focus:border-[#B89146] transition-colors font-light text-slate-800 placeholder:text-slate-300 text-center"
                        />
                        <span className="absolute right-0 top-2 text-[10px] text-slate-400">3 digits</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* 3. PromptPay QR */}
        <div 
          onClick={() => setPaymentMethod("promptpay")}
          className={`border cursor-pointer transition-all duration-300 overflow-hidden group ${
            paymentMethod === "promptpay" ? "border-[#B89146] bg-white shadow-md" : "border-slate-200 hover:border-[#B89146]"
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === "promptpay" ? "border-[#B89146]" : "border-slate-300"}`}>
                {paymentMethod === "promptpay" && <div className="w-2.5 h-2.5 rounded-full bg-[#B89146]"></div>}
              </div>
              <div>
                <h4 className={`font-serif text-lg transition-colors ${paymentMethod === "promptpay" ? "text-[#B89146]" : "text-slate-800 group-hover:text-[#B89146]"}`}>PromptPay QR</h4>
                <p className="text-xs font-light text-slate-500 mt-1">Scan to pay with any Thai banking app</p>
              </div>
            </div>
          </div>

          {/* --- ส่วน QR Code และอัปโหลด --- */}
          {paymentMethod === "promptpay" && (
            <div className="px-6 pb-8 pt-2 border-t border-slate-100 bg-[#FAF9F6] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
               <div className="flex flex-col items-center mt-6">
                 
                 {/* Mock QR Code */}
                 <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 mb-6">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                      alt="PromptPay QR" 
                      className="w-32 h-32 opacity-80"
                    />
                    <p className="text-center text-[10px] mt-2 uppercase tracking-widest text-slate-500">Scan to Pay</p>
                 </div>

                 {/* Upload Slip Input */}
                 <div className="w-full">
                   <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 text-center">Upload Proof of Payment (Slip)</label>
                   <div className="relative border border-dashed border-slate-300 rounded-sm bg-white hover:bg-slate-50 transition-colors p-6 text-center group/upload">
                       <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                       <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                           <span className="text-2xl text-slate-300 group-hover/upload:text-[#B89146] transition-colors">☁️</span>
                           <span className="text-xs font-light text-slate-500">Click to upload or drag and drop</span>
                           <span className="text-[9px] text-slate-400">JPG, PNG (Max 5MB)</span>
                       </div>
                   </div>
                 </div>

               </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
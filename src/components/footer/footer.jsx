import React from "react";
import "./footer.scss";
import { Button, Icon } from "semantic-ui-react";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span>Thông tin chung</span>
          <ul>
            <li>Giới thiệu về công ty</li>
            <li>Tin tuyển dụng</li>
            <li>Liên hệ, góp ý</li>
            <li>Tin tức</li>
          </ul>
        </div>
        <div className="footer-location">
          <span>Chi nhánh</span>
          <ul>
            <li>152 ABC, Thanh Khê, TP. Đà Nẵng</li>
            <li>162 ABC, Thanh Khê, TP. Đà Nẵng</li>
            <li>172 ABC, Thanh Khê, TP. Đà Nẵng</li>
          </ul>
        </div>
        <div className="footer-social">
          <span>Liên lạc</span>
          <br />
          <div className="footer-icon">
            <a href="https://www.facebook.com/tanphu.phan.90/" target="_blank">
              <Button circular color="facebook" icon="facebook" />
            </a>
            <a href="https://youtu.be/SM-eVC3jRc4"target="_blank">
              <Button circular color="youtube" icon="youtube" />
            </a>
            <a href="https://tanphu.phan.90" target="_blank">
              <Button circular color="instagram" icon="instagram" />
            </a>
            <a href="http://"target="_blank">
              <Button circular color="twitter" icon="twitter" />
            </a>
          </div>
        </div>
      </div>
      <p className="designer">Designed by Tan Phu</p>
    </div>
  );
}
export default Footer;

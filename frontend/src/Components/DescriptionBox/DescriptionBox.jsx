import React from 'react'
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-navbox">Description</div>
        <div className="descriptionbox-navbox fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Our ecommerce platform offers a diverse range of products, from trendy
          fashion apparel to cutting-edge electronics. With a user-friendly
          interface and secure payment options, shopping with us is a breeze. We
          prioritize customer satisfaction, ensuring swift delivery and
          hassle-free returns. Explore our curated collections today to discover
          the perfect items for your needs, all at competitive prices. Shop with
          confidence and convenience at our ecommerce store.
        </p>
        <p>
          Discover an unparalleled shopping experience at our ecommerce
          platform, where quality meets affordability. Browse through our
          extensive selection of products, meticulously curated to cater to your
          diverse preferences. Enjoy seamless navigation and exceptional
          customer service every step of the way.
        </p>
      </div>
    </div>
  );
}

export default DescriptionBox

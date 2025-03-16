import React from "react";
import styles from "../styles/ProductQuickView.module.css";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import ActionButton from "./ui/ActionButton";

const ProductQuickView = ({ onClose, onAddToCart, product }) => {

//Temparory added, need to get from api
const category = "Shoes / Casual Sneaker";

  return (
    <main className={styles.productQuickView}>
      <section className={styles.productContainer}>
        <div className={styles.productContent}>
          <header className={styles.breadcrumbs}>
            <p className={styles.breadcrumbPath}>{category}</p>
          </header>

          <div className={styles.productLayout}>
            <ProductGallery productImage={product.img} />
            <ProductDetails
              name={product.name}
              price={product.price}
              description={product.description}
            />
          </div>

          <div className={styles.actionSection}>
          <ActionButton 
            text="Add to Cart"
            onClick={onAddToCart}
            className="w-2/5 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors rounded-[12px]">    
          </ActionButton>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductQuickView;


import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { Trash2 } from 'lucide-react';
import styles from './CartItems.module.css'
const CartItems = ({ items, updateQuantity, removeItem }) => {
    return (
        <Card className={styles.card}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>Items</th>
                        <th className={styles.th}>Price</th>
                        <th className={styles.th}>Quantity</th>
                        <th className={styles.th}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className={styles.tr}>
                            <td className={styles.td1}>
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className={styles.img}
                                />
                                <div>
                                    <p className={styles.itemName}>{item.name} </p>
                                    <p> Size: EU {item.size[3]}</p>
                                    <p> Color: Black</p>
                                </div>
                            </td>
                            <td className={styles.td}>${item.price}</td>
                            <td className={styles.td}>
                                <div className={styles.divQuantity}>
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity - 1)}
                                        className={styles.btnQuantity}
                                    >
                                        -
                                    </button>
                                    <span className={styles.itemQuantity}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity + 1)}
                                        className={styles.btnQuantityRight}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td className={styles.td}>
                                <div className={styles.summary}>
                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                    <Trash2
                                        size={20}
                                        className={styles.delete}
                                        onClick={() => removeItem(index)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

export default CartItems;
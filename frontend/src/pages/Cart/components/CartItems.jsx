import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { Trash2 } from 'lucide-react';

const CartItems = ({ items, updateQuantity, removeItem }) => {
    return (
        <Card className="p-6 bg-white/70 backdrop-blur-lg min-h-[400px]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-2">Items</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2 flex items-center gap-4">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="rounded-[12px] object-cover h-[90px] w-[120px]"
                                />
                                <div>
                                    <p className="font-bold">{item.name} </p>
                                    <p> Size: EU {item.size[3]}</p>
                                    <p> Color: Black</p>
                                </div>
                            </td>
                            <td className="p-2">${item.price}</td>
                            <td className="p-2">
                                <div className="flex items-center justify-between gap-2 border bg-[#F7FAFC] rounded-[20px] px-1 w-[90px]">
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity - 1)}
                                        className="px-2 border-r mt-0"
                                    >
                                        -
                                    </button>
                                    <span className="text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity + 1)}
                                        className="px-2 border-l mt-0"
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td className="p-2">
                                <div className="flex items-center justify-between gap-4 p-1 min-w-[100px]">
                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                    <Trash2
                                        size={20}
                                        className="cursor-pointer text-gray-500"
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
import { Card } from "@/components/ui/Card";
const CartDetails = ({ total }) => {
    return (
        <Card className="p-6 bg-white/70 backdrop-blur-lg min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Details</h2>
            <div className="h-[300px] flex flex-col justify-evenly">
                <div>
                    <div className="flex justify-between border-b py-2">
                        <p className="font-semibold">Sub Total</p>
                        <p>${total}</p>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <p className="font-semibold">Tax</p>
                        <p>$32.00</p>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <p className="font-semibold">Total</p>
                        <p>${total + 32.00}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center min-h-[100px]">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors rounded-[12px]">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </Card>
    )
}

export default CartDetails;
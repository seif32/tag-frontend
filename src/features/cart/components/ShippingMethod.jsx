import { FaCircleDot } from "react-icons/fa6";

function ShippingMethod() {
  return (
    <div className="flex flex-col gap-6 px-6 py-6 border border-gray-200 rounded-xl">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Shipping Method</h2>
        <div className="border border-gray-100"></div>

        <div className="flex ">
          <div>
            <FaCircleDot />
          </div>
          <div className="flex">
            <h3>Free Shipping</h3>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingMethod;

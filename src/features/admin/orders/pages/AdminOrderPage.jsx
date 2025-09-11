import { useParams } from "react-router";

function AdminOrderPage() {
  const { orderId } = useParams();
  return <div>Hello {orderId}</div>;
}

export default AdminOrderPage;

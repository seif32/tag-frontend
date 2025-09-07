import { useAuthStore } from "@/auth/store/authStore";
import { formatPhone } from "@/utils/formatPhone";

function CustomerInfo() {
  const user = useAuthStore((state) => state.user);
  console.log(user);
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="flex flex-col gap-6 px-6 py-6 border border-gray-200 rounded-xl">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Customer Information</h2>
        <div className="border border-gray-100"></div>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="">
          <span className="mr-2 text-muted-foreground">Name:</span> {fullName}
        </p>
        <p className="">
          <span className="mr-2 text-muted-foreground">Email:</span>{" "}
          {user.email}
        </p>
        <p className="">
          <span className="mr-2 text-muted-foreground">Phone:</span>{" "}
          {formatPhone(user.phone_number)}
        </p>
      </div>
    </div>
  );
}

export default CustomerInfo;

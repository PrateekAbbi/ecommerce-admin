import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";
import { Separator } from "@/components/ui/separator";

const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`)
  const { orderDetails, customer } = await res.json()

  const { street, city, state, postalCode, country } = orderDetails.shippingAddress

  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-heading2-bold">
        Order ID: <span className="text-heading2-bold">{orderDetails._id}</span>
      </p>

      <Separator className="bg-grey-1 my-5" />

      <p className="text-base-bold">
        Customer Name: <span className="text-base-medium">{customer.name}</span>
      </p>

      <p className="text-base-bold">
        Shipping Address:{" "}
        <span className="text-base-medium">
          {street}, {city}, {state}, {postalCode}, {country}
        </span>
      </p>

      <p className="text-base-bold">
        Total Paid:{" "}
        <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>

      <p className="text-base-bold">
        Shipping Rate ID:{" "}
        <span className="text-base-medium">{orderDetails.shippingRate}</span>
      </p>

      <DataTable
        columns={columns}
        data={orderDetails.products}
        searchKey="product"
      />
    </div>
  );
};

export default OrderDetails;

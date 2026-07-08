import CarForm from "@/components/admin/CarForm";
export default function EditCarPage({ params }: { params: { id: string } }) {
  return <CarForm carId={params.id} />;
}

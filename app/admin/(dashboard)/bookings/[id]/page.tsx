import BookingForm from "@/components/admin/BookingForm";
export default function EditBookingPage({ params }: { params: { id: string } }) { return <BookingForm bookingId={params.id} />; }

import CategoryForm from "@/components/admin/CategoryForm";
export default function EditCategoryPage({ params }: { params: { id: string } }) { return <CategoryForm catId={params.id} />; }

import ArticleForm from "@/components/admin/ArticleForm";
export default function EditArticlePage({ params }: { params: { id: string } }) { return <ArticleForm articleId={params.id} />; }

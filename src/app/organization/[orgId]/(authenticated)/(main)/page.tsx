import { redirect } from "next/navigation";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default function Page({ params }: PageProps) {
  return redirect(`/organization/${params.orgId}/products`);
}

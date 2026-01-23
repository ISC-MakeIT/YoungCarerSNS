import ChatRoom from "@/features/chat/components/chat-room";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ChatRoom roomId={id} />;
}

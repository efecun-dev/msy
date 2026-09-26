import { prisma } from "@/lib/prisma";
import { Mail, Check } from "lucide-react";
import MessageRow from "@/components/admin/MessageRow";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Gelen Mesajlar</h1>
          <p className="text-panel-11 text-xs mt-1">
            İletişim formundan gönderilen müşteri talepleri ve mesajlar.
          </p>
        </div>
      </div>

      <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-panel-11 text-sm">
            Henüz hiç mesajınız bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-panel-6">
            {messages.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

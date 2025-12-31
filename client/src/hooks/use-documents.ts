import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type DocumentResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useDocuments() {
  return useQuery({
    queryKey: [api.documents.list.path],
    queryFn: async () => {
      const res = await fetch(api.documents.list.path);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return api.documents.list.responses[200].parse(await res.json());
    },
    // Poll every 3 seconds to update status of processing documents
    refetchInterval: (query) => {
      const hasPending = query.state.data?.some(
        (doc) => doc.status === "pending" || doc.status === "processing"
      );
      return hasPending ? 3000 : false;
    },
  });
}

export function useDocument(id: number) {
  return useQuery({
    queryKey: [api.documents.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.documents.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch document");
      return api.documents.get.responses[200].parse(await res.json());
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "processing" ? 2000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.documents.upload.path, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }

      return api.documents.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
      toast({
        title: "Upload Successful",
        description: "Your document is now being processed by the OCR engine.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    },
  });
}

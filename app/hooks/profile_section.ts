import { isLoggedIn } from "@/lib/wixAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import updateMember, {
  getLoggedInMember,
  UpdateMemberValues,
  uploadMemberPhoto,
} from "../wix-api/members";

const getMemberQueryKey = ["loggedInMember"];

export const useMember = () => {
  return useQuery({
    queryKey: getMemberQueryKey,
    queryFn: getLoggedInMember,
    enabled: isLoggedIn(),
    staleTime: 1000 * 60 * 5, // ← cache for 5 minutes
  });
};

interface UseUpdateMemberArgs {
  memberId: string;
  values: UpdateMemberValues;
  localPhotoUri: string | null;
  currentPhotoUrl?: string | null; // ← add this
}
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      values,
      localPhotoUri,
      currentPhotoUrl, // ← add this
    }: UseUpdateMemberArgs) => {
      let photoUrl = values.photoUrl;
      console.log(photoUrl);
      console.log(localPhotoUri);
      console.log(currentPhotoUrl, "currentPhotoUrl");

      // ← If user picked a new photo, upload it first
      if (localPhotoUri) {
        console.log("Starting photo upload...");
        // ← Pass memberId so file goes to members/profile-photos/{memberId}/profile.jpg
        photoUrl = await uploadMemberPhoto(
          localPhotoUri,
          memberId,
          currentPhotoUrl,
        );
        console.log("Photo upload success:", photoUrl);
      }
      const result = await updateMember(memberId, { ...values, photoUrl });
      console.log("Member update success");
      return result;
    },

    onSuccess: (updatedMember) => {
      // ← Update cache instantly without refetch
      queryClient.setQueryData(getMemberQueryKey, updatedMember);
      console.log("Profile updated ✅");
    },

    onError: (error) => {
      console.log("Update failed:", error);
    },
  });
};

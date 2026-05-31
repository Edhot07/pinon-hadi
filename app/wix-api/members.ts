import { WEB_BASE_URL } from "@/lib/constants";
import { AddressValues } from "@/lib/validations/profileSchema";
import { wixClient } from "@/lib/wix-client.base";
import { members } from "@wix/members";
import { cache } from "react";

//Get logged in member
export const getLoggedInMember = cache(async () => {
  if (!wixClient.auth.loggedIn()) return null;

  const memberData = await wixClient.members.getCurrentMember({
    fieldsets: [members.Set.FULL],
  });

  return memberData.member || null;
});

//Update Member
export interface UpdateMemberValues {
  nickname?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string; // ← Wix media URL after upload
  addresses?: AddressValues[];
}

export default async function updateMember(
  memberId: string,
  values: UpdateMemberValues,
) {
  const updatedMember = wixClient.members.updateMember(memberId, {
    profile: {
      nickname: values.nickname,
      ...(values.photoUrl && {
        photo: { url: values.photoUrl }, // ← only update if new photo
      }),
    },
    contact: {
      firstName: values.firstName,
      lastName: values.lastName,

      phones: values.phone ? [values.phone] : [],
      addresses:
        values.addresses?.map((addr) => ({
          addressLine: addr.addressLine,
          addressLine2: addr.addressLine2,
          city: addr.city,
          subdivision: addr.subdivision,
          country: addr.country,
          postalCode: addr.postalCode,
        })) ?? [],
    },
  });
  return updatedMember;
}

export async function uploadMemberPhoto(
  localUri: string,
  memberId: string,
  oldPhotoUrl?: string | null, // ← add this
): Promise<string> {
  // Step 1 — Get file info from local URI
  const filename = localUri.split("/").pop() ?? "profile.jpg";
  const mimeType = filename.toLowerCase().endsWith(".png")
    ? "image/png"
    : "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    name: "profile.jpg", // ← always profile.jpg
    type: mimeType,
  } as any);
  formData.append("memberId", memberId);

  // ← Pass old photo URL for deletion
  if (oldPhotoUrl) {
    formData.append("oldPhotoUrl", oldPhotoUrl);
  }

  const response = await fetch(`${WEB_BASE_URL}/api/upload-photo`, {
    method: "POST",
    body: formData,
    // ← Do NOT set Content-Type manually
    // FormData sets it automatically with boundary
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Upload error response:", error);
    throw new Error(`Upload failed: ${error}`);
  }

  const { url } = await response.json();
  console.log(
    "Photo uploaded successfully(lets see the url from the server): ",
    url,
  );
  return url;
}

// {
//   if (!filename || !mimeType) {
//     throw new Error("File name and mimeType must be there");
//   }

//   // Step 2 — Generate signed upload URL from Wix
//   try {
//     const { uploadUrl } = await getWixAdminClient().files.generateFileUploadUrl(
//       mimeType,
//       {
//         fileName: filename,
//         filePath: "members/profile-photos", // ← folder in Wix Media Manager
//         private: false,
//       },
//     );
//     console.log("Step 2 - uploadUrl generated:", uploadUrl);

//     if (!uploadUrl) {
//       console.log("Failed to generate wix upload URL");
//       throw new Error("failed to generate wix upload URL");
//     }

//     // Step 3 — Read file as binary blob
//     const response = await fetch(localUri);
//     const blob = await response.blob();
//     console.log("Step 3 - blob size:", blob.size, "type:", blob.type);

//     // Step 4 — PUT file to Wix signed URL
//     const uploadResponse = await fetch(uploadUrl, {
//       method: "PUT",
//       headers: {
//         "Content-Type": mimeType,
//       },
//       body: blob,
//     });
//     console.log("Step 4 - upload status:", uploadResponse.status);

//     if (!uploadResponse.ok) {
//       throw new Error(`Upload failed: ${uploadResponse.status}`);
//     }

//     // Step 5 — Parse response to get the Wix media URL
//     const result = await uploadResponse.json();

//     console.log("Step 5 - result:", JSON.stringify(result, null, 2));

//     // ← Wix returns the file URL here
//     const wixFileUrl: string =
//       result?.file?.url ?? result?.fileDescriptor?.url ?? result?.url;

//     if (!wixFileUrl) throw new Error("No URL returned from upload");
//     return wixFileUrl;
//   } catch (error) {
//     console.log("Upload error at which step?", error);
//     throw error;
//   }
// }

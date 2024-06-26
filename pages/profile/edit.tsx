import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import fileUploader from "@/libs/client/fileUploader";
import Image from "next/image";
import Seo from "@/components/Seo";
import { useRouter } from "next/router";
import useDelete from "@/libs/client/useDelete";
import useUpdate from "@/libs/client/useUpdate";
import DeleteModal from "@/components/DeleteModal";

interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}
const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [editProfile, { data, loading }] =
    useUpdate<EditProfileResponse>(`/api/users/me`);

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch, //모든 form의 변경 사항 감지
  } = useForm<EditProfileForm>();

  //user가 있거나 변경되면 setValue함수로 email폼에 user.email 자동으로 채우기
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.avatar) setAvatarPreview(user?.avatar);
  }, [user, setValue]);

  const onValid = async ({ name, email, phone, avatar }: EditProfileForm) => {
    if (loading) return;
    // 이메일/폰 모두 입력 안한 경우
    if (email === "" && phone === "") {
      return setError("formErrors", {
        message: "이메일 혹은 전화번호 중 하나를 입력하세요.",
      });
    }
    if (name === "") {
      return setError("formErrors", {
        message: "이름을 입력하세요.",
      });
    }

    //유저가 아바타 파일 선택한 경우
    if (avatar && avatar.length > 0 && user) {
      //클라우디너리로 파일 업로드
      const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_AVATAR_PRESET_NAME;
      const avatarUrl = await fileUploader(avatar[0], `${presetName}`);

      editProfile({ email, phone, name, avatarUrl });
    } else {
      //console.log({ email, phone });
      editProfile({ email, phone, name });
    }
  };

  //editProfile로 뮤테이션한 data 지켜보고 data 변경될 때마다 바뀌기
  useEffect(() => {
    if (data && !data.ok && data.error) {
      return setError("formErrors", {
        message: data.error,
      });
    }
    if (data?.ok) {
      router.replace(`/profile/${user?.id}`);
      //상품 업로드 끝나면 상품 상세 페이지로 이동
    }
  }, [data, setError, router, user]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const fileList = watch("avatar");

  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const avatar = fileList[0];
      //브라우저 메모리에 있는 파일 url 가져오기
      //(blob:http~~) blob이 붙은 이 url은 브라우저의 메모리에 존재함
      setAvatarPreview(URL.createObjectURL(avatar));
    }
  }, [fileList]);

  const [deleteUser, { data: deleteData, loading: deleteUserLoading }] =
    useDelete("/api/users/me");

  const deleteHandler = () => {
    if (deleteUserLoading) return;
    deleteUser({});
    closeDeleteModalHandler();
  };

  //딜리트모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModalHandler = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModalHandler = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    if (deleteData?.ok) {
      router.replace("/login");
    }
  }, [deleteData, router]);

  return (
    <Layout canGoBack title="프로필 수정">
      <Seo
        title="프로필 수정 | 네이버후드"
        description="네이버후드 프로필 수정"
      />
      <form onSubmit={handleSubmit(onValid)} className="py-5 px-4 space-y-5">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="avatar-preview"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full bg-slate-300 object-cover"
              priority
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-300" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 hover:bg-slate-100 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-lime-600 text-gray-700"
          >
            수정
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="이름"
          name="name"
          kind="text"
          placeholder="이름을 입력하세요."
        />
        <Input
          register={register("email")}
          required={false}
          label="이메일 주소"
          name="email"
          kind="email"
          placeholder="이메일 주소를 입력하세요."
        />
        <Input
          register={register("phone")}
          required={false}
          label="휴대전화 번호"
          name="phone"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button
          onClick={() => clearErrors()}
          text="프로필 수정하기"
          loading={loading}
        />
      </form>
      <div className="px-4">
        <Button
          onClick={openDeleteModalHandler}
          text="회원 탈퇴하기"
          loading={deleteUserLoading}
          bgGray
        />
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={closeDeleteModalHandler}
          onDelete={deleteHandler}
          contentText="정말로 탈퇴하겠습니까?"
          buttonText="탈퇴하기"
        />
      )}
    </Layout>
  );
};

export default EditProfile;

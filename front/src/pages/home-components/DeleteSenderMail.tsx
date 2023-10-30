import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import Loading from "../../components/Loading";
import http from "../../services/http";
import { sURL } from "../../c";

const DeleteSenderMail = ({ Id }: { Id: number }) => {
  const [error, setError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button
            disabled={isDeleting}
            color="red"
            variant="soft"
            size={"1"}
            className="cursor-pointer"
          >
            Delete
            {isDeleting && <Loading />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this. This action can not be undone.
          </AlertDialog.Description>

          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                color="red"
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await http.delete(`${sURL.senderMail}${Id}/`);
                    window.location.reload();
                  } catch (error) {
                    setIsDeleting(false);
                    setError(true);
                  }
                }}
              >
                Delete Mail
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This email could not be deleted.
          </AlertDialog.Description>
          <AlertDialog.Action>
            <Button
              color="gray"
              variant="soft"
              mt="2"
              onClick={() => {
                setError(false);
              }}
            >
              OK
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteSenderMail;

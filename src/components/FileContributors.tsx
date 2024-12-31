import { BaseHTMLAttributes, useState } from "react"
import { Avatar } from "@chakra-ui/react"

import type { ChildOnlyProp, FileContributor } from "@/lib/types"

import { Button } from "@/components/ui/buttons/Button"
import InlineLink from "@/components/Link"
import Modal from "@/components/Modal"
import Translation from "@/components/Translation"
import { Flex, VStack } from "@/components/ui/flex"
import { ListItem, UnorderedList } from "@/components/ui/list"

import { trackCustomEvent } from "@/lib/utils/matomo"

import Modal from "./ui/dialog-modal"

import { useBreakpointValue } from "@/hooks/useBreakpointValue"

const ContributorList = ({ children }: Required<ChildOnlyProp>) => (
  <UnorderedList className="max-h-64 m-6 mb-0 ml-0 mr-0 overflow-y-scroll">
    {children}
  </UnorderedList>
)

type ContributorProps = { contributor: FileContributor }
const Contributor = ({ contributor }: ContributorProps) => (
  <ListItem className="p-2 flex items-center">
    <Avatar
      height="40px"
      width="40px"
      src={contributor.avatar_url}
      name={contributor.login}
      me={2}
    />
    <InlineLink href={"https://github.com/" + contributor.login}>
      @{contributor.login}
    </InlineLink>
  </ListItem>
)

type FlexProps = BaseHTMLAttributes<HTMLDivElement> & { asChild?: boolean }
export type FileContributorsProps = FlexProps & {
  contributors: FileContributor[]
  lastEditLocaleTimestamp: string
}

const FileContributors = ({
  contributors,
  lastEditLocaleTimestamp,
  ...props
}: FileContributorsProps) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const lastContributor: FileContributor = contributors.length
    ? contributors[0]
    : ({
        avatar_url: "",
        login: "",
        html_url: "",
        date: Date.now().toString(),
      } as FileContributor)

  const modalSize = useBreakpointValue({ base: "xl", md: "md" } as const)

  return (
    <>
      <Modal
        open={isModalOpen}
        onOpenChange={(open) => setModalOpen(open)}
        size={modalSize}
        title={<Translation id="contributors" />}
      >
        <Translation id="contributors-thanks" />
        <ContributorList>
          {contributors.map((contributor) => (
            <Contributor contributor={contributor} key={contributor.login} />
          ))}
        </ContributorList>
      </Modal>

      <Flex className="flex-col p-0 md:flex-row md:p-2"
        {...props}
      >
        <Flex className="me-4 items-center flex-1 invisible md:visible md:flex">
          <Avatar
            height="40px"
            width="40px"
            src={lastContributor.avatar_url}
            name={lastContributor.login}
            me={2}
          />

          <p className="m-0 text-body-medium">
            <Translation id="last-edit" />:{" "}
            <InlineLink href={"https://github.com/" + lastContributor.login}>
              @{lastContributor.login}
            </InlineLink>
            , {lastEditLocaleTimestamp}
          </p>
        </Flex>

        <VStack className="items-stretch justify-between space-y-2 items-center">
            <Button 
            className="bg-background border-none mb-4 w-full md:mb-0 md:w-inherit" 
            variant="outline" 
            onClick={() => {
              setModalOpen(true)
              trackCustomEvent({
                eventCategory: "see contributors",
                eventAction: "click",
                eventName: "click",
              })
            }}>
            <Translation id="see-contributors" />
          </Button>
        </VStack>
      </Flex>
    </>
  )
}

export default FileContributors

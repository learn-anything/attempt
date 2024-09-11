"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/manage"
import { parseAsBoolean, useQueryState } from "nuqs"
import { atom, useAtom } from "jotai"
import { LinkBottomBar } from "./bottom-bar"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"

export const isDeleteConfirmShownAtom = atom(false)

export function LinkRoute(): React.ReactElement {
	const [nuqsEditId] = useQueryState("editId")
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
	const [isInCreateMode] = useQueryState("create", parseAsBoolean)
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const [isDeleteConfirmShown] = useAtom(isDeleteConfirmShownAtom)
	const [disableEnterKey, setDisableEnterKey] = useState(false)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const handleCommandPaletteClose = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		setDisableEnterKey(true)
		timeoutRef.current = setTimeout(() => {
			setDisableEnterKey(false)
			timeoutRef.current = null
		}, 100)
	}, [])

	useEffect(() => {
		if (isDeleteConfirmShown || isCommandPaletteOpen || isInCreateMode) {
			setDisableEnterKey(true)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		} else if (!isCommandPaletteOpen) {
			handleCommandPaletteClose()
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [isDeleteConfirmShown, isCommandPaletteOpen, isInCreateMode, handleCommandPaletteClose])

	return (
		<>
			<LinkHeader />
			<LinkManage />
			<LinkList
				key={nuqsEditId}
				activeItemIndex={activeItemIndex}
				setActiveItemIndex={setActiveItemIndex}
				disableEnterKey={disableEnterKey}
			/>
			<LinkBottomBar />
		</>
	)
}

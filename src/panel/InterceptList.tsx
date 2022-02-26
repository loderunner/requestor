import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  Clear as ClearIcon,
  Plus as PlusIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@/icons'
import { useIntercept, useIntercepts } from '@/interceptor/hooks'
import { usePaused } from '@/interceptor/hooks/intercept'

import List from './components/List'
import ModalInput from './components/ModalInput'
import { useSelection } from './selection'

import type { Intercept } from '@/interceptor'
import type { SyntheticEvent } from 'react'

interface ItemProps {
  interceptId: string
  paused: boolean
  onDelete: (inter: Intercept) => void
  editOnRender: boolean
}

const Item = ({ interceptId, onDelete, editOnRender, paused }: ItemProps) => {
  const { selection, setSelection, selectionType } = useSelection()
  const { intercept, updateIntercept } = useIntercept(interceptId)
  const [editing, setEditing] = useState(false)
  const patternLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => setEditing(editOnRender), [editOnRender])

  const onToggleEnabled = useCallback(
    () => updateIntercept({ enabled: !intercept.enabled }),
    [intercept.enabled, updateIntercept]
  )

  const onChangeInput = useCallback(
    (value) => {
      updateIntercept({ pattern: value })
      setEditing(false)
    },
    [updateIntercept]
  )

  const onCancelInput = useCallback(() => setEditing(false), [])

  const onClickDelete = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      onDelete(intercept)
    },
    [intercept, onDelete]
  )

  const onSelect = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      setSelection({ ...intercept })
    },
    [intercept, setSelection]
  )

  const onDoubleClickPattern = useCallback((e: SyntheticEvent) => {
    if (!patternLabelRef.current) {
      return
    }
    e.stopPropagation()
    setEditing(true)
  }, [])

  // Computed className from selection
  const className = useMemo(() => {
    let className = 'flex w-full select-none justify-between p-1'
    if (selectionType !== 'intercept') {
      return className
    }
    const s = selection as Intercept
    if (s.id === intercept.id) {
      className += ' bg-blue-100'
    }
    return className
  }, [selectionType, selection, intercept.id])

  return (
    <div className={className} role="listitem" onClick={onSelect}>
      <div className="flex flex-grow items-center overflow-hidden">
        <input
          type="checkbox"
          className={`mr-0.5 focus:ring-0 ${paused ? 'text-gray-400' : ''}`}
          checked={intercept.enabled}
          onClick={(e) => e.stopPropagation()}
          onChange={onToggleEnabled}
        />
        <span
          className={`w-full mx-0.5 overflow-hidden text-ellipsis whitespace-nowrap ${
            paused ? 'text-gray-400' : ''
          }`}
          onDoubleClick={onDoubleClickPattern}
          ref={patternLabelRef}
        >
          {intercept.pattern === '' ? '\u200b' : intercept.pattern}
        </span>
        {editing && patternLabelRef.current ? (
          <ModalInput
            element={patternLabelRef.current}
            value={intercept.pattern}
            onChange={onChangeInput}
            onCancel={onCancelInput}
          />
        ) : null}
      </div>
      <button
        className="self-stretch"
        title="Delete intercept"
        onClick={onClickDelete}
      >
        <ClearIcon className="h-full w-auto" />
      </button>
    </div>
  )
}

interface Props {
  className?: string
}

const InterceptList = ({ className = '' }: Props) => {
  const [paused, setPaused] = usePaused()
  const { selection, setSelection, selectionType } = useSelection()
  const { intercepts, addIntercept, removeIntercept } = useIntercepts()
  const [newIntercept, setNewIntercept] = useState<string>('')

  const onPause = useCallback(() => setPaused(true), [setPaused])
  const onUnpause = useCallback(() => setPaused(false), [setPaused])

  const onDeleteIntercept = useCallback(
    (inter: Intercept) => {
      if (inter.id === undefined) {
        throw new Error('missing intercept id')
      }
      if (selectionType === 'intercept') {
        const s = selection as Intercept
        if (s.id === inter.id) {
          setSelection(null)
        }
      }
      removeIntercept(inter.id)
    },
    [removeIntercept, selection, selectionType, setSelection]
  )

  const onAddIntercept = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      const inter = addIntercept({ pattern: '', enabled: true, regexp: false })
      setNewIntercept(inter.id)
      setSelection({ ...inter })
    },
    [addIntercept, setSelection]
  )

  const pauseButton = useMemo(
    () =>
      paused ? (
        <button
          className="self-stretch"
          title="Unpause intercepts"
          onClick={onUnpause}
        >
          <VisibilityOffIcon className="h-full w-auto" />
        </button>
      ) : (
        <button
          className="self-stretch"
          title="Pause intercepts"
          onClick={onPause}
        >
          <VisibilityIcon className="h-full w-auto" />
        </button>
      ),
    [onPause, onUnpause, paused]
  )

  const header = useMemo(() => {
    return (
      <div className="p-1 flex space-x-1 justify-between select-none bg-slate-100">
        <span className="font-bold flex-auto">Intercepts</span>
        {pauseButton}
        <button
          className="self-stretch"
          title="Add intercept"
          onClick={onAddIntercept}
        >
          <PlusIcon className="h-full w-auto" />
        </button>
      </div>
    )
  }, [onAddIntercept, pauseButton])

  const items = useMemo(
    () =>
      intercepts.map((inter) => (
        <Item
          key={inter.id}
          interceptId={inter.id}
          paused={paused}
          onDelete={onDeleteIntercept}
          editOnRender={newIntercept === inter.id}
        />
      )),
    [intercepts, paused, onDeleteIntercept, newIntercept]
  )

  return (
    <List
      id="intercept-list"
      className={className}
      header={header}
      items={items}
    ></List>
  )
}

export default InterceptList

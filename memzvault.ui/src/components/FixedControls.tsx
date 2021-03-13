import React, { FC } from 'react'

import styled from 'styled-components'

const FixedContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const ControlItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Icon = styled.div`
  cursor: pointer;
  padding: 20px;
  font-size: 40px;
  user-select: none;
`

interface FixedControlsProps {
  onAdd(): void
  onSettings(): void
}

export const FixedControls: FC<FixedControlsProps> = ({
  onSettings,
  onAdd,
}) => {
  return (
    <FixedContainer>
      <ControlItem>
        <Icon onClick={onSettings}>⚙</Icon>
      </ControlItem>
      <ControlItem>
        <Icon onClick={onAdd}>✚</Icon>
      </ControlItem>
    </FixedContainer>
  )
}

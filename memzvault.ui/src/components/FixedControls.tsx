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
  padding: 20px 30px;
  font-size: 40px;
  user-select: none;
  background: ${({ theme }) => theme.colors.bg3};
  opacity: 0.5;
`

interface FixedControlsProps {
  onAdd(): void
  onSettings(): void
  onLogout(): void
}

export const FixedControls: FC<FixedControlsProps> = ({
  onSettings,
  onAdd,
  onLogout,
}) => {
  return (
    <FixedContainer>
      <ControlItem>
        <Icon onClick={onLogout}>⬿</Icon>
      </ControlItem>
      <ControlItem>
        <Icon onClick={onSettings}>⚙</Icon>
      </ControlItem>
      <ControlItem>
        <Icon onClick={onAdd}>✚</Icon>
      </ControlItem>
    </FixedContainer>
  )
}

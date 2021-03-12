import { FC } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'

import { dialogVisibility } from '../state/dialogState'

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`

const DialogContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.bg2};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg1};
`

const Cross = styled.div`
  position: absolute;
  font-size: 30px;
  line-height: 25px;
  padding: 10px;
  right: 0;
  top: 0;
  cursor: pointer;
`

export const Dialog: FC = ({ children }) => {
  const [, setDialog] = useRecoilState(dialogVisibility)
  return (
    <Overlay onClick={() => setDialog(null)}>
      <DialogContainer onClick={(e) => e.stopPropagation()}>
        <Cross onClick={() => setDialog(null)}>✘</Cross>
        {children}
      </DialogContainer>
    </Overlay>
  )
}

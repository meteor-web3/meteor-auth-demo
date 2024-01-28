import styled from "styled-components";

export const MainContainer = styled.main`
  padding: 0 1.5rem 1.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 1.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .brand {
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .learn-more {
    a {
      color: hsl(0, 0%, 50%);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.25rem;
      transition: color 0.15s ease-in-out;
      cursor: pointer;

      &:hover {
        color: hsl(0, 0%, 35%);
      }
    }
  }
`;

export const CardContainer = styled.section`
  border: 1px solid hsl(0, 0%, 92%);
  border-radius: 12px;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
`;

export const PanelContainer = styled.div`
  flex: 0 0 auto;
  width: 24rem;
  padding: 0 1.5rem;

  .configuration {
    display: flex;
    flex-direction: column;

    .config-header {
      padding: 1.5rem 0 0.5rem;
      border-bottom: 1px solid hsl(0, 0%, 92%);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .config-item {
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid hsl(0, 0%, 92%);
      row-gap: 0.5rem;

      .config-item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.25rem;
        }
      }

      .card-check-box {
        flex-direction: row-reverse;
        width: 100%;
        justify-content: space-between;
        padding: 0 0.75rem;
        height: 2.5rem;
        border: 1px solid hsl(0, 0%, 92%);
        border-radius: 0.375rem;

        > * {
          margin: 0;
        }

        > *:first-child {
          background-color: #ffffff;
          border: 1px solid hsl(0, 0%, 92%);
          &:has(> *) {
            background-color: hsl(0, 0%, 92%);
          }
        }

        > *:last-child {
          font-size: 0.8rem;
        }
      }
    }
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 1rem;
  row-gap: 0.5rem;
`;

export const InnerContainer = styled.div`
  background-color: hsl(0, 0%, 92%);
  padding: 2rem 5rem;
  width: 100%;
`;

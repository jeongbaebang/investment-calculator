# 투자 수익 계산기

투자 원금과 수익률을 기반으로 매도 시 실제 수익을 계산해주는 웹 애플리케이션

## 개요

해당 프로젝트는 투자자들이 보유 자산의 일부를 매도할 때 발생하는 실제 수익을 정확히 계산할 수 있도록 도와주는 도구입니다.
특히 고령층 사용자를 고려하여 직관적인 인터페이스와 접근성 기능을 제공합니다.

일부분 매도시 얼마의 수익이 나오는지 일일이 계산하는 불편함을 개선하고자 나온 웹 도구입니다.

## 주요 기능

### 핵심 기능

- **투자 수익 계산**: 투자원금, 수익률, 매도금액을 입력하여 실제 수익 계산
- **상세 분석**: 매도 비율, 남은 자산, 남은 수익 등 포괄적인 분석 제공
- **실시간 비트코인 가격**: CoinGecko API를 통한 현재 비트코인 시세 표시

### 사용자 경험

- **다크모드 지원**: 라이트/다크/시스템 모드 3단계 테마 전환
- **접근성**: 폰트 크기 조절 (12px~24px)
- **한글 표시**: 숫자를 한글로 변환하여 가독성 향상
- **반응형 디자인**: 모바일 최적화된 인터페이스

### 기술적 특징

- **서버 사이드 렌더링**: 초기 로딩 성능 최적화
- **실시간 업데이트**: 30초 간격 자동 가격 업데이트
- **하이브리드 아키텍처**: SSR + 클라이언트 사이드 업데이트

## 기술 스택

### 프레임워크 및 언어

- **Next.js 15**: React 기반 풀스택 프레임워크 (App Router)
- **TypeScript**: 타입 안전성을 위한 정적 타입 언어
- **React 18**: 사용자 인터페이스 라이브러리

### 스타일링 및 UI

- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Lucide React**: 아이콘 라이브러리
- **next-themes**: 다크모드 구현

### 외부 서비스

- **CoinGecko API**: 암호화폐 가격 데이터 제공

## 설치 및 실행

### 사전 요구사항

- Node.js 20.0 이상
- npm

### 로컬 개발 환경 설정

1. **저장소 클론**

   ```bash
   git clone https://github.com/jeongbaebang/investment-calculator.git
   cd investment-calculator
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드된 애플리케이션 실행
npm start
```

## 사용 방법

### 기본 사용법

1. **투자원금 입력**

   - 원금을 입력하면 자동으로 천의 자리 콤마가 추가됩니다
   - 입력 즉시 한글 표기도 함께 표시됩니다

2. **수익률 입력**

   - 백분율로 입력 (예: 2% → 2 입력)
   - 소수점 입력 가능

3. **매도금액 입력**

   - 매도하려는 금액을 입력합니다
   - 총 자산 가치를 초과할 수 없습니다

4. **결과 확인**
   - 실제 수익, 매도 비율, 남은 자산 등을 확인할 수 있습니다

### 고급 기능

- **테마 전환**: 우상단 버튼으로 라이트/다크/시스템 모드 순환
- **폰트 크기 조절**: 글자 크기 조절 섹션에서 가독성 조정
- **실시간 가격**: 비트코인 가격 자동 업데이트 및 수동 새로고침

## API 명세

### CoinGecko API 연동

```typescript
// GET /api/bitcoin-price
interface BitcoinPriceResponse {
  price: number; // KRW 가격
  lastUpdated: string; // ISO 8601 형식
}
```

### 레이트 리미트

- **무료 API**: 5-15 calls/minute (변동)
- **Demo API**: 30 calls/minute (권장)
- **캐싱**: 30초 간격으로 업데이트

## 성능 최적화

### 서버 사이드 최적화

- **ISR(Incremental Static Regeneration)**: 5분마다 재검증
- **서버 컴포넌트**: 초기 데이터 서버에서 렌더링

### 클라이언트 사이드 최적화

- **지연 로딩**: 컴포넌트별 코드 스플리팅
- **캐싱**: API 응답 캐싱으로 불필요한 요청 방지
- **에러 바운더리**: 안정적인 사용자 경험

## 접근성 (Accessibility)

### 시각적 접근성

- **폰트 크기 조절**: 12px~24px 단계별 조정
- **고대비 모드**: 다크모드 지원
- **한글 병기**: 숫자의 한글 표기 제공

### 사용성

- **키보드 내비게이션**: 모든 기능 키보드 접근 가능
- **스크린 리더**: ARIA 레이블 및 시맨틱 마크업
- **반응형**: 다양한 화면 크기 지원

## 기여 가이드

토이프로젝트이기 때문에 리뷰후 100% PR 머지 반영됩니다.

### Fork 워크플로우

1. **저장소 Fork**

   - GitHub에서 저장소 우상단의 "Fork" 버튼 클릭
   - 본인 계정으로 저장소를 복사합니다

2. **로컬 Clone**

   ```bash
   git clone https://github.com/jeongbaebang/investment-calculator.git
   cd investment-calculator
   ```

3. **원본 저장소 추가**

   ```bash
   git remote add upstream https://github.com/jeongbaebang/investment-calculator.git
   ```

4. **브랜치 생성 (only 영어)**

   ```bash
   git checkout -b feature/새로운-기능
   # 또는
   git checkout -b fix/버그-수정
   ```

5. **개발 및 테스트**

   ```bash
   # 의존성 설치
   npm install

   # 개발 서버 실행
   npm run dev

   # 코드 품질 검사
   npm run lint

   # 타입 검사
   npm run type-check
   ```

6. **변경사항 커밋**

   ```bash
   git add .
   git commit -m "feat: 새로운 기능 추가"
   ```

7. **Fork된 저장소에 Push**

   ```bash
   git push origin feature/새로운-기능
   ```

8. **Pull Request 생성**
   - GitHub에서 본인 Fork 저장소로 이동
   - "Compare & pull request" 버튼 클릭
   - PR 템플릿에 따라 상세한 설명 작성

### 코드 스타일

- **ESLint**: `npm run lint`로 코드 스타일 검사
- **TypeScript**: 엄격한 타입 검사

## 라이선스

해당 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

## 문의 및 지원

- **이슈 리포트**: GitHub Issues 탭 활용
- **기능 요청**: GitHub Issues 탭 활용

---

**투자는 신중하게, 계산은 정확하게** 💡

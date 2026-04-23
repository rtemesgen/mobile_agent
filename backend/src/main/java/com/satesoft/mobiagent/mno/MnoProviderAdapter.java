package com.satesoft.mobiagent.mno;

import com.satesoft.mobiagent.domain.MnoTransaction;
import org.springframework.stereotype.Component;

public interface MnoProviderAdapter {
    ProviderResult recordTransaction(MnoTransaction transaction);
    record ProviderResult(boolean successful, String message) {}
}

@Component
class StubMnoProviderAdapter implements MnoProviderAdapter {
    public ProviderResult recordTransaction(MnoTransaction transaction) {
        return new ProviderResult(true, "Stub MNO provider accepted the transaction");
    }
}
